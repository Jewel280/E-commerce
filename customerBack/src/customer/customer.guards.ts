import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
@Injectable()
export class SessionGuard implements CanActivate {
static CanActivate: any;
canActivate(
context: ExecutionContext,): boolean {
        const request = context.switchToHttp().getRequest();
        return (request.session.username !== undefined);
    }
}