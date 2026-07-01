import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Email } from '../../../domain/value-objects/Email';
import { LoginUserCommand } from './LoginUserCommand';
import { JwtService } from '../../../infrastructure/auth/JwtService';
import { PasswordHashingService } from '../../../infrastructure/auth/PasswordHashingService';

export interface LoginResult {
  token: string;
  userId: string;
  email: string;
  displayName: string;
}

@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand, LoginResult> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  public async execute(command: LoginUserCommand): Promise<LoginResult> {
    const email = Email.create(command.email);
    const user = await this.userRepository.findByEmail(email);

    // Prevent user enumeration by using the same error for both "not found" and "wrong password"
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = this.passwordHashingService.verify(command.password, user.passwordHash.value);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      sub: user.id.value,
      email: user.email.value,
      displayName: user.displayName.value,
    });

    return {
      token,
      userId: user.id.value,
      email: user.email.value,
      displayName: user.displayName.value,
    };
  }
}
