import { action, computed, observable } from "mobx";
import { User, UserRole } from "../models/User";
import { ui } from "./UiUtil";

export interface LoginResult {
  token: string,
  username: string,
  role: string
}



export function encryptPassword(password: string) {
  return password;
}



export class UserStore {
  @observable user: User = null;



  @computed
  public get loggedIn() {
    return !!this.user;
  }

  get token() {
    return this.user ? this.user.token : null;
  }

  @computed
  public get isAdmin() {
    return this.user && this.user.role === UserRole.Admin;
  }

  @action public logout = () => {
    this.user = null;
    this.clearUser();
  };


  @action login = async (response: LoginResult) => {
    this.user = new User(response.username, response.role, response.token);
  };

  remember = () => {
    ui.localStorage.setItem("user", JSON.stringify(this.user));
  };

  clearUser = () => {
    ui.localStorage.removeItem("user");

  };

  constructor(detectLocalStorage: boolean = true) {
    if (detectLocalStorage) {
      const user = ui.localStorage.getItem("user");
      if (user) {
        try {
          this.user = User.parse(JSON.parse(user));
        } catch (ignored) {
        }
      }
    }
  }
}