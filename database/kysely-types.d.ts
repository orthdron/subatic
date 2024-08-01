import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type VideoStatus = "DONE" | "FAILED" | "UPLOADING";

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
  duration: Generated<number>;
  id: Generated<string>;
  status: Generated<VideoStatus>;
  title: string;
  userId: string;
}

export interface DB {
  user: User;
  userSession: UserSession;
  video: Video;
}
