/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/admin` | `/(auth)/create` | `/(auth)/dashboard` | `/(auth)/execution` | `/(auth)/history` | `/(auth)/library` | `/(auth)/progress` | `/(auth)/routines` | `/_sitemap` | `/admin` | `/create` | `/dashboard` | `/execution` | `/history` | `/library` | `/login` | `/progress` | `/register` | `/routines`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
