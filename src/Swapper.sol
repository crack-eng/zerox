// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Swapper is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;

    enum SwapStatus {
        Initiated,
        Transferred,
        Completed,
        Failed,
        Cancelled
    }

    struct Swap {
        uint256 amount;
        SwapStatus status;
        address swapper;
    }

    mapping(bytes16 => Swap) public swaps;

    event SwapInitiated(bytes16 indexed id, uint256 amount);
    event SwapTransferred(bytes16 indexed id, uint256 amount, address swapper);
    event SwapCompleted(bytes16 indexed id);
    event SwapFailed(bytes16 indexed id);
    event SwapCancelled(bytes16 indexed id);

    error SWAP_ALREADY_EXISTS();
    error SWAP_NOT_INITIATED();
    error SWAP_NOT_TRANSFERRED();
    error SWAP_ALREADY_COMPLETED();
    error SWAP_ALREADY_CANCELLED();

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function initiateSwap(bytes16 _id, uint256 _amount) external onlyOwner {
        if (swaps[_id].amount != 0) revert SWAP_ALREADY_EXISTS();
        swaps[_id] = Swap(_amount, SwapStatus.Initiated, address(0));
        emit SwapInitiated(_id, _amount);
    }

    function transferSwap(bytes16 _id) external nonReentrant {
        Swap storage swap = swaps[_id];
        if (swap.status != SwapStatus.Initiated) revert SWAP_NOT_INITIATED();

        usdc.safeTransferFrom(msg.sender, address(this), swap.amount);

        swap.status = SwapStatus.Transferred;
        swap.swapper = msg.sender;
        emit SwapTransferred(_id, swap.amount, msg.sender);
    }

    function completeSwap(bytes16 _id) external onlyOwner {
        Swap storage swap = swaps[_id];
        if (swap.status != SwapStatus.Transferred) revert SWAP_NOT_TRANSFERRED();

        swap.status = SwapStatus.Completed;
        emit SwapCompleted(_id);
    }

    function failSwap(bytes16 _id) external onlyOwner {
        Swap storage swap = swaps[_id];
        if (swap.status == SwapStatus.Completed) revert SWAP_ALREADY_COMPLETED();
        if (swap.status == SwapStatus.Cancelled) revert SWAP_ALREADY_CANCELLED();

        if (swap.status == SwapStatus.Transferred) {
            usdc.safeTransfer(swap.swapper, swap.amount);
        }

        swap.status = SwapStatus.Failed;
        emit SwapFailed(_id);
    }

    function cancelSwap(bytes16 _id) external onlyOwner {
        Swap storage swap = swaps[_id];
        if (swap.status != SwapStatus.Initiated) revert SWAP_NOT_INITIATED();

        swap.status = SwapStatus.Cancelled;
        emit SwapCancelled(_id);
    }

    function withdrawFunds(address _to, uint256 _amount) external onlyOwner {
        usdc.safeTransfer(_to, _amount);
    }
}
