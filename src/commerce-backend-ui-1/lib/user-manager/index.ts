/*
 * <license header>
 */

/* This file exposes the UserManager class for user management functionality */

import type { User } from './types';

/**
 * UserManager class for managing user operations
 *
 * @example
 * ```typescript
 * const userManager = new UserManager();
 * const user = userManager.get('john.doe');
 * console.log(user.name); // "john.doe"
 * ```
 */
export class UserManager {
  /**
   * Get a user by name
   * @param name - The user's name
   * @returns User object with the provided name
   * @throws {Error} When name is empty or invalid
   */
  public get(name: string): User {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a non-empty string');
    }

    const trimmedName: string = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Name cannot be empty or whitespace only');
    }

    return {
      name: trimmedName,
    };
  }
}

// Export types for convenience
export type { User } from './types';

// Export as default for backward compatibility
export default UserManager;
