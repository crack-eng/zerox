type Button =
  | {
      id: string;
      type: "default" | "destructive";
      text?: string;
    }
  | {
      id: string;
      type: "ok" | "close" | "cancel";
    };

type Chat = "users" | "bots" | "groups" | "channels";

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type Notification = "error" | "success" | "warning";

type HapticFeedback =
  | {
      type: "impact";
      impact_style: ImpactStyle;
      notification_type?: Notification;
    }
  | {
      type: "notification";
      impact_style?: ImpactStyle;
      notification_type: Notification;
    }
  | {
      type: "selection_change";
      impact_style?: ImpactStyle;
      notification_type: Notification;
    };

export type MethodData = {
  iframe_ready: {
    reload_supported?: boolean;
  };
  iframe_will_reload: never;
  web_app_biometry_get_info: never;
  web_app_biometry_open_settings: never;
  web_app_biometry_request_access: {
    reason?: string;
  };
  web_app_biometry_request_auth: {
    reason?: string;
  };
  web_app_biometry_update_token: {
    token: string;
  };
  web_app_close: never;
  web_app_close_scan_qr_popup: never;
  web_app_data_send: {
    data: string;
  };
  web_app_expand: never;
  web_app_invoke_custom_method: {
    req_id: string;
    method: string;
    params: unknown;
  };
  web_app_open_invoice: {
    slug: string;
  };
  web_app_open_link: {
    url: string;
    try_instant_view?: boolean;
  };
  web_app_open_popup: {
    title: string;
    message: string;
    buttons: [Button] | [Button, Button] | [Button, Button, Button];
  };
  web_app_open_scan_qr_popup: {
    text?: string;
  };
  web_app_open_tg_link: {
    path_full: string;
  };
  web_app_read_text_from_clipboard: {
    req_id: string;
  };
  web_app_ready: never;
  web_app_request_phone: never;
  web_app_request_theme: never;
  web_app_request_viewport: never;
  web_app_request_write_access: never;
  web_app_set_background_color: {
    color: string;
  };
  web_app_set_header_color: {
    color_key?: string;
    color?: string;
  };
  web_app_setup_back_button: {
    is_visible: boolean;
  };
  web_app_setup_closing_behavior: {
    need_confirmation: boolean;
  };
  web_app_setup_main_button: {
    is_visible?: boolean;
    is_active?: boolean;
    is_progress_visible?: boolean;
    text?: string;
    color?: string;
    text_color?: string;
  };
  web_app_setup_settings_button: {
    is_visible: boolean;
  };
  web_app_setup_swipe_behavior: {
    allow_vertical_swipe: boolean;
  };
  web_app_switch_inline_query: {
    query: string;
    chat_types: Chat[];
  };
  web_app_trigger_haptic_feedback: HapticFeedback;
};

export type EventData = {
  back_button_pressed: never;
  biometry_auth_requested: {
    status: "failed" | "authorized";
    token?: string;
  };
  biometry_info_received: {
    available: boolean;
    access_requested: boolean;
    access_granted: boolean;
    device_id: string;
    token_saved: boolean;
    type: "face" | "finger";
  };
  biometry_token_updated: {
    status: "updated" | "removed";
  };
  clipboard_text_received: {
    req_id: string;
    data: string | null;
  };
  custom_method_invoked: {
    req_id: string;
    result?: unknown;
    error?: string;
  };
  invoice_closed: {
    slug: string;
    status: "paid" | "failed" | "pending" | "cancelled";
  };
  main_button_pressed: never;
  phone_requested: {
    status: "sent";
  };
  popup_closed: {
    button_id?: string;
  };
  reload_iframe: never;
  qr_text_received: {
    data?: string;
  };
  scan_qr_popup_closed: never;
  set_custom_style: {
    style: string;
  };
  settings_button_pressed: never;
  theme_changed: {
    theme_params: Record<string, string>;
  };
  viewport_changed: {
    height: number;
    width?: number;
    is_expanded: boolean;
    is_state_stable: boolean;
  };
  write_access_requested: {
    status: "allowed";
  };
};
