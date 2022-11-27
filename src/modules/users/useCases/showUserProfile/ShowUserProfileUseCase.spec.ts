import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Get Info User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able get info user profile", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "12345",
    });

    const findUser = await showUserProfileUseCase.execute(user.id as string);

    expect(findUser).toEqual(user);
  });

  it("should not be able to show user profile with nonexistent user", async () => {
    await expect(
      showUserProfileUseCase.execute("mocked_user_id")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
