export interface UserProfile {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  email?: string;
  contact: string;
  address: string;
  role: string;
  image: string;
  image_url: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  buyer_profile?: BuyerProfile;
  dealer_profile?: DealerProfile;
  broker_profile?: BrokerProfile;
}

export interface BuyerProfile {
  loyalty_points: number;
  loyalty_programs: LoyaltyProgram[];
}

export interface LoyaltyProgram {
  id: number;
  points: number;
  reward: string;
  created_at: string; // ISO timestamp
}

export interface DealerProfile {
  id: number;
  profile: DealerPersonalProfile;
  role: string;
  company_name: string;
  license_number: string;
  tax_id: string;
  telebirr_account: string;
  is_verified: boolean;
}

export interface DealerPersonalProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact: string;
  address: string;
  image: string;
}

export interface BrokerProfile {
  id: number;
  profile: number; // points to a UserProfile.id (FK)
  national_id: string;
  telebirr_account: string;
  is_verified: boolean;
  role: string;
}
