export default interface RepositoryInterface<T> {
  create(entity: T): Promise<void>;
  update(id: string, entity: T): Promise<void>;
  find(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}
