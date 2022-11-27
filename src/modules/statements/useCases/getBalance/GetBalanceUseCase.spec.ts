import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get new balance", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345",
    };

    const { id } = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as any,
      amount: 2000,
      description: "description",
    });

    const balance = await getBalanceUseCase.execute({ user_id: id as string });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get balance to a nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "user_id_mocked"});

    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});