import { IRepository } from '@rrss-auto/domain';
import { User } from '../aggregates/User';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';

export interface IUserRepository extends IRepository<User, UserId> {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
