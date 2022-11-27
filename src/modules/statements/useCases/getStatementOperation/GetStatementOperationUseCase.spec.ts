import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    const { id } = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as any,
      amount: 2000,
      description: "description",
    });

    const balance = await getStatementOperationUseCase.execute({
      user_id: id as string,
      statement_id: statement.id as string,
    });

    expect(balance).toHaveProperty("id");
  });

  it("should not be able to get a statement to a nonexistent user", async () => {
    await expect(async () => {
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
        description: "description",
      });

      await getStatementOperationUseCase.execute({
        user_id: "user_id_mocked",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
