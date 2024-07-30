export interface Ivideo {
  _id: Id;
  title: string;
  description: string;
  thumbnail: string;
  preview_video: string;
  original_video: string;
  language: string;
  status: boolean;
  duration: string;
  category: string[];
  is_feature_video: boolean;
  created_by_id: string;
  created_by_name: string;
  certification: string;
  processedImages: ProcessedImages;
  user: {
    profilePic: string;
    email: string;
    full_name: string;
    password: string;
    followingId: string[];
    membership: string;
    is_active: boolean;
    createdAt: any;
    updatedAt: any;
    __v: number;
  };
  createdAt: any;
  updatedAt: any;
  __v: number;
  views: number;
  viewsId: ViewsId[];
  likesId: LikesId[];
  likes: number;
}

export interface Id {
  $oid: string;
}

export interface ProcessedImages {
  medium: Medium;
  small: Small;
  high: High;
}

export interface Medium {
  caption: string;
  path: string;
  width: number;
  height: number;
  type: string;
}

export interface Small {
  caption: string;
  path: string;
  width: number;
  height: number;
  type: string;
}

export interface High {
  caption: string;
  path: string;
  width: number;
  height: number;
  type: string;
}

export interface ViewsId {
  $oid: string;
}

export interface LikesId {
  $oid: string;
}
