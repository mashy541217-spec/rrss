export interface IERPTransaction {
  /**
   * Commits the current transaction to the ERP database.
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction if an error occurs.
   */
  rollback(): Promise<void>;
  
  /**
   * Returns whether the transaction is active.
   */
  isActive(): boolean;
}
