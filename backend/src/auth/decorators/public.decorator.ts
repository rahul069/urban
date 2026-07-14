import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marks a route as reachable without authentication. Note: no guard in
// this codebase currently reads IS_PUBLIC_KEY (see AuthModule — it has
// no JWT guard at all yet), so today this decorator is documentation
// only, not enforcement. It exists so app.controller.ts's health check
// compiles and so a future global auth guard has a way to opt routes
// out without more churn.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
