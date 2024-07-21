import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type VideoStatus = "DONE" | "FAILED" | "IN_QUEUE" | "PROCESSING" | "REJECTED" | "UPLOADING" | "USER_STATUS_UPLOADED";

export interface User {
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<string>;
  passwordHash: string;
  userName: string;
}

export interface UserSession {
  expiresAt: Timestamp;
  id: string;
  userId: string;
}

export interface Video {
  createdAt: Generated<Timestamp>;
  description: string;
  duration: number | null;
  id: Generated<string>;
  status: Generated<VideoStatus | null>;
  title: string;
  userId: string;
}

export interface DB {
  user: User;
  userSession: UserSession;
  video: Video;
}
