import { IUserRepository } from '../../../../../../apps/api/src/modules/identity/domain/repositories/IUserRepository';
import { User } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/User';
import { UserId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/UserId';
import { Email } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/Email';

export class FakeUserRepository implements IUserRepository {
  private readonly items = new Map<string, User>();

  public async save(user: User): Promise<void> {
    this.items.set(user.id.value, user);
  }

  public async findById(id: UserId): Promise<User | null> {
    const user = this.items.get(id.value);
    return user || null;
  }

  public async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.items.values()) {
      if (user.email.value.toLowerCase() === email.value.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  public async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  // Testing helper methods
  public getSavedUsers(): User[] {
    return Array.from(this.items.values());
  }

  public clear(): void {
    this.items.clear();
  }
}
