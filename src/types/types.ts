export interface Product {
  id: string;
  created_at?: string;
  updated_at?: string;
  product_id?: string;
  product_part_number?: string;
  product_type?: string;
  product_name?: string;
  product_description?: string;
  duration?: string;
  vendor_name?: string;
  vendor_part_number?: string;
  license_source_set?: string;
  source_name?: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;
  eval_set_name?: string;
  renewal_set_name?: string;
  new_set_name?: string;
  active?: boolean | null;
  created_by?: number;
  updated_by?: number;
  organization?: Partial<Organization>;
  email_template?: Partial<EmailTemplate>;
  product_source_id?: string
}

export interface Email_Schedule{
    id?: string;
    email_template?: string;
    send_now?: boolean;
    schedule_time?: string;
    scheduled_time?: string;
    is_sent?: boolean;
    schedule_server?: string;
    periodic_task?: string;
    is_recurring?: boolean;
    active?: boolean;
    organization?: string;
}

export interface Seat {
  id?: number;
  created_at?: string;
  updated_at?: string;
  seat_id?: number;
  status?: string;
  license_server_status?: string;
  created_by?: number;
  updated_by?: number;
  asset?: string;
}
export interface Asset {
  asset_id?: string;
  osc_product?: Partial<Product>;
  seats?: Seat[];
  transactions?: Transaction[];
  owner?: Partial<Customer>;
  created_at?: string;
  updated_at?: string;
  license_key?: string;
  license_type?: string;
  start_date?: string;
  end_date?: string;
  active_seats?: number;
  expired_seats?: number;
  license_server_seat_count?: number;
  osc_seat_count?: number;
  renewal_seats?: number;
  revoked_seats?: number;
  suspended_seats?: number;
  terminated_seats?: number;
  active?: boolean;
  created_by?: number;
  updated_by?: number;
  organization?: Partial<Organization>;
  bill_customer?: Partial<Customer>;
  ship_customer?: Partial<Customer>;
  reseller?: Partial<Customer>;
  bill_customer_address?: Partial<Address>;
  ship_customer_address?: Partial<Address>;
  reseller_address?: Partial<Address>;
  bill_customer_contact?: Partial<Contact>;
  ship_customer_contact?: Partial<Contact>;
  reseller_contact?: Partial<Contact>;
  license_key_created_email_notification_date?: string;
  one_month_reminder_notification_date?: string;
  two_month_reminder_notification_date?: string;
  renew_due_notification_date?: string;
  expired_notification_date?: string;
  last_email_date?: string;
  agreement_accepted_datetime?: string;
  agreement_accepted?: boolean;
}

export type SeatStatus = {
  seat_id?: number;
  vendor_part_number?: number;
  osc_start_date?: string;
  osc_end_date?: string;
  osc_license_status?: string;
  lic_start_date?: string;
  lic_end_date?: string;
  license_status?: string;
  status_update_date?: string;
};

export type AssetTransaction = {
  txn_number?: string;
  txn_date?: string;
  vendor_part?: string;
  osc_part_number?: string;
  seat_count?: number;
  start_date?: string;
  end_date?: string;
};

// export enum EmailType {
//     USER_INVITATION = 'USER_INVITATION',
//     LICENSE_KEY_CREATED = 'LICENSE_KEY_CREATED',
//     LICENSE_KEY_1_MONTH_REMINDER = 'LICENSE_KEY_1_MONTH_REMINDER',
//     LICENSE_KEY_2_MONTH_REMINDER = 'LICENSE_KEY_2_MONTH_REMINDER',
//     LICENSE_KEY_RENEW_DUE_REMINDER = 'LICENSE_KEY_RENEW_DUE_REMINDER',
//     LICENSE_KEY_EXPIRED_1_MONTH = 'LICENSE_KEY_EXPIRED_1_MONTH'
// }

export interface EmailTemplate {
  email_id?: string;
  type?: string;
  event_type?: string;
  subject?: string;
  description?: string;
  cc?: string;
  bcc?: string;
  body?: string;
  from_email?: string;
  name?: string;
  product_family?: string;
  product_type?: string;
  created_by?: any,
  updated_by?: any,
}

export interface Organization {
  organization_code: string;
  organization_name: string;
  country?: string;
  address?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  add_all_customers_in_email: boolean;
}

export interface User {
  user_id?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  organizations?: Organization[];
  organization?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  roles?: Role[];
}

export interface APIKey {
  id?: string;
  created?: string;
  name?: string;
  revoked?: boolean;
}

export interface Role {
  role_id?: string;
  description?: string;
  name?: string;
  permissions?: Permission[];
}

export interface Permission {
  id?: string;
  codename?: string;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface Transaction {
  id?: string;
  transaction_number?: number;
  asset?: Partial<Asset>;
  product?: Partial<Product>;
  bill_customer?: Partial<Customer>;
  bill_customer_address?: Partial<Address>;
  bill_customer_contact?: Partial<Contact>;
  ship_customer?: Partial<Customer>;
  ship_customer_address?: Partial<Address>;
  ship_customer_contact?: Partial<Address>;
  reseller?: Partial<Customer>;
  reseller_address?: Partial<Address>;
  reseller_contact?: Partial<Address>;
  created_at?: string;
  updated_at?: string;
  transaction_id: string;
  transaction_date?: string;
  product_part_number?: string;
  product_name?: string;
  transaction_source?: string;
  transaction_status?: string;
  transaction_action?: string;
  source_reference_number?: string;
  source_reference_date?: string;
  source_reference_id?: string;
  notification_date?: string;
  quantity?: number;
  start_date?: string;
  end_date?: string;
  comments?: string;
  error_message?: string;
  created_by?: number;
  updated_by?: number;
  organization?: string;
  source_integration_status?: string;
  source_integration_error?: string;
  license_integration_status?: string;
  license_type?: string;
}

export interface InputTransaction {
  transaction_source?: string;
  transaction_action?: string;
  license_type?: string;
  source_reference_number?: string;
  source_reference_date?: string;
  source_reference_id?: string;
  bill_customer_account?: string;
  bill_customer_name?: string;
  bill_address1?: string;
  bill_address2?: string;
  bill_city?: string;
  bill_state?: string;
  bill_postal_code?: string;
  bill_country?: string;
  bill_contact_first_name?: string;
  bill_contact_last_name?: string;
  bill_contact_phone?: string;
  bill_contact_email?: string;
  ship_customer_account?: string;
  ship_customer_name?: string;
  ship_address1?: string;
  ship_address2?: string;
  ship_city?: string;
  ship_state?: string;
  ship_postal_code?: string;
  ship_country?: string;
  ship_contact_first_name?: string;
  ship_contact_last_name?: string;
  ship_contact_phone?: string;
  ship_contact_email?: string;
  reseller_customer_account?: string;
  reseller_customer_name?: string;
  reseller_address1?: string;
  reseller_address2?: string;
  reseller_city?: string;
  reseller_state?: string;
  reseller_postal_code?: string;
  reseller_country?: string;
  reseller_contact_first_name?: string;
  reseller_contact_last_name?: string;
  reseller_contact_phone?: string;
  reseller_contact_email?: string;
  osc_part_number?: string;
  quantity?: number;
  start_date?: string;
  end_date?: string;
}

export interface Customer {
  account?: string;
  account_id?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
}

export interface Report {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  organization?: string;
  created_by?: any;
  updated_by?: any;
}

export interface Lookup {
  lookup_code?: string;
  lookup_name?: string;
  description?: string;
  lookup_id?: string;
  type?: string;
  active?: boolean;
  parent_lookup?: Lookup;
  is_default?: boolean;
}

export interface LookupValue {
  id?: string;
  value?: string;
  meaning?: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  dependency?: string;
  active?: boolean;
  is_new?: boolean;
  parent_value?: string;
}

export interface Reference {
  created_at?: string;
  updated_at?: string;
  reference_id?: string;
  reference_name?: string;
  reference_description?: string;
  reference_type?: string;
  data_source?: string;
  transaction_source?: string;
  organization?: string;
  active?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface ReferenceCode {
  id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  product_part_number?: string;
  product_part_id?: string;
  osc_product_id?: string;
  transaction_line_id?: string;
  reference_code?: string;
  organization?: Partial<Organization>;
  osc_product?: Partial<Product>;
  reference?: Partial<Reference>;
  reference_code_id?: string;
  transaction?: Partial<Transaction>;
}

export interface Partner {
  partner_id?: string;
  account_id?: string;
  website?: string;
  partner_number?: string;
  name?: string;
  type?: string;
  addresses?: Partial<Address[]>;
  contacts?: Partial<Contact[]>;
  active?: boolean;
}

export interface Address {
  address_id?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  active?: boolean;
}

export interface Contact {
  contact_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  job_title?: string;
  renewal_notification?: boolean;
  primary?: boolean
}

export interface EmailHistory {
  status?: string;
  sent_at?: string;
  error_message?: string;
  asset?: Partial<Asset>;
  email_template?: Partial<EmailTemplate>;
}
