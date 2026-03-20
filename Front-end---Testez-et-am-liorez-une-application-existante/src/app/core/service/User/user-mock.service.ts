import { Register } from '../../models/Authentication';
import { Observable, of } from 'rxjs';

export class UserMockService {
  register(user: Register): Observable<Object> {
    return of();
  }
}
