/*
 * <license header>
 */

import { UserManager, User } from '@lib/user-manager'

describe('UserManager', () => {
  let userManager: UserManager

  beforeEach(() => {
    userManager = new UserManager()
  })

  describe('get', () => {
    it('should return a user with the provided name', () => {
      const result: User = userManager.get('John')
      expect(result).toEqual({ name: 'John' })
    })

    it('should trim whitespace from name', () => {
      const result: User = userManager.get('  John  ')
      expect(result).toEqual({ name: 'John' })
    })

    it('should handle names with special characters', () => {
      const result: User = userManager.get("O'Brien")
      expect(result).toEqual({ name: "O'Brien" })
    })

    it('should handle names with numbers', () => {
      const result: User = userManager.get('User123')
      expect(result).toEqual({ name: 'User123' })
    })

    it('should handle names with special characters and spaces', () => {
      const result: User = userManager.get('User@123#Test')
      expect(result).toEqual({ name: 'User@123#Test' })
    })

    it('should accept names with spaces', () => {
      const result: User = userManager.get('John Doe')
      expect(result).toEqual({ name: 'John Doe' })
    })

    it('should accept names with hyphens', () => {
      const result: User = userManager.get('Mary-Jane')
      expect(result).toEqual({ name: 'Mary-Jane' })
    })

    it('should accept names with apostrophes', () => {
      const result: User = userManager.get("O'Connor")
      expect(result).toEqual({ name: "O'Connor" })
    })

    it('should accept long names', () => {
      const longName = 'a'.repeat(100)
      const result: User = userManager.get(longName)
      expect(result).toEqual({ name: longName })
    })

    it('should throw an error if name is empty string', () => {
      expect(() => userManager.get('')).toThrow('Name must be a non-empty string')
    })

    it('should throw an error if name contains only whitespace', () => {
      expect(() => userManager.get('   ')).toThrow('Name cannot be empty or whitespace only')
    })

    it('should throw an error if name is undefined', () => {
      expect(() => userManager.get(undefined as unknown as string)).toThrow(
        'Name must be a non-empty string'
      )
    })

    it('should throw an error if name is null', () => {
      expect(() => userManager.get(null as unknown as string)).toThrow(
        'Name must be a non-empty string'
      )
    })

    it('should throw an error if name is not a string', () => {
      expect(() => userManager.get(123 as unknown as string)).toThrow(
        'Name must be a non-empty string'
      )
    })
  })
})
