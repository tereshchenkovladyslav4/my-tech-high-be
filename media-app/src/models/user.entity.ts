import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  email?: string

  @Column()
  password?: string

  @Column()
  firstName?: string

  @Column()
  lastName?: string

  @Column()
  level?: number

  @Column()
  updatedAt?: string

  @Column()
  avatarUrl?: string
}
