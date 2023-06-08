import Address from './address';

describe('Address unit tests', () => {
  it('should throw error when street is empty', () => {
    expect(() => {
      const address = new Address('', 5, '9000-90', 'São Paulo', 'São Paulo');
    }).toThrowError('Street is required');
  });
  it('should throw error when number is empty', () => {
    expect(() => {
      const address = new Address(
        'Rua A',
        0,
        '9000-90',
        'São Paulo',
        'São Paulo',
      );
    }).toThrowError('Number is required');
  });

  it('should throw error when zip code is empty', () => {
    expect(() => {
      const address = new Address('Rua A', 5, '', 'São Paulo', 'São Paulo');
    }).toThrowError('Zip Code is required');
  });

  it('should throw error when city is empty', () => {
    expect(() => {
      const address = new Address('Rua A', 5, '9000-90', '', 'São Paulo');
    }).toThrowError('City is required');
  });

  it('should throw error when state is empty', () => {
    expect(() => {
      const address = new Address('Rua A', 5, '9000-90', 'São Paulo', '');
    }).toThrowError('State is required');
  });

  it('should return address', () => {
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );
    expect(address.toString()).toBe('Rua A, 5, São Paulo, São Paulo, 9000-90');
  });
});
