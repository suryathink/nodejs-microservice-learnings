import { Event, eventStore } from "../eventStore";

class Account {
  deposit(accountId: string, amount: number): boolean {
    eventStore.addEvent({
      accountId: accountId,
      eventType: "Deposit",
      amount: amount,
    });

    return true;
  }

  withdraw(accountId: string, amount: number): boolean {
    eventStore.addEvent({
      accountId: accountId,
      eventType: "Withdraw",
      amount,
    });
    return true;
  }

  getBalance(accountId: string): number {
    const events = eventStore.getEvent(accountId);
    let balance = 0;
    events.forEach((event) => {
      if (event.eventType === "Deposit") {
        balance += event.amount;
      } else if (event.eventType === "Withdraw") {
        balance -= event.amount;
      }
    });
    return balance;
  }

  getUserHistory(accountId:string):Event[] {
    return eventStore.getEvent(accountId)
  }
}


export const accountService = new Account();