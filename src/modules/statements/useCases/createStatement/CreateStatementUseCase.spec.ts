import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    const { id } = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as any,
      amount: 1000,
      description: "test description",
    });

    expect(statement).toHaveProperty("id");
  });

  
  it("should not be able to create a new statement to a nonexisting user", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    await createUserUseCase.execute(user);

    await expect(
      createStatementUseCase.execute({
        user_id: "user_id_mocked",
        type: "deposit" as any,
        amount: 2000,
        description: "description",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
