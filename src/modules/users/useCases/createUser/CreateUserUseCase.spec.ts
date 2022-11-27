import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id")
  });

  it("should be able create a new user with same email", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    await expect(
      createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      })
    ).rejects.toBeInstanceOf(CreateUserError)
  });
});
