export interface NavLink {
  readonly label: string;
  readonly path: string;
  /** Match the route exactly when highlighting the active link. */
  readonly exact?: boolean;
}
