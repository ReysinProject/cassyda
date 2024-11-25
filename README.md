# Cassida Core
A flexible and extensible authentication library for TypeScript applications.

![GitHub package.json version](https://img.shields.io/github/package-json/v/ReysinProject/cassyda-core)
![GitHub License](https://img.shields.io/github/license/ReysinProject/cassyda-core)
![GitHub top language](https://img.shields.io/github/languages/top/ReysinProject/cassyda-core)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/ReysinProject/cassyda-core)
![GitHub contributors](https://img.shields.io/github/contributors-anon/ReysinProject/cassyda-core)


---

<p align="center">⚠️ Please note that the package is in the experimental development phase. ⚠️</p>
<p align="center">⚠️ You may use it at your own risk ⚠️. </p>

---


## Overview
This authentication library provides a robust, scheme-based authentication system supporting multiple providers, and storage strategies. It's designed to be framework-agnostic and easily extensible.

## Features
- 🔐 Multiple authentication schemes (OAuth2, JWT, Credentials)
- 👥 Role-based access control
- 📦 Customizable storage strategies
- 🔄 Token refresh handling
- 🎯 Provider-agnostic design

## Installation

```bash
npm install @cassida/core
# or
yarn add @cassida/core
# or
pnpm add @cassida/core
```

## Quick Start

```typescript
import { AuthClient, AuthConfig } from '@cassida/core';

const config: AuthConfig = {
  schemes: {
    default: {
      id: 'default',
      name: 'Default Scheme',
      providers: [
        new OAuth2Provider({
          clientId: 'your-client-id',
          clientSecret: 'your-client-secret',
          redirectUri: 'http://localhost:3000/callback'
        })
      ],
      options: {
        tokenType: 'JWT'
      }
    }
  },
  defaultScheme: 'default',
  storage: new LocalStorageStrategy()
};

const auth = new AuthClient(config);
```

## Core Concepts

### Authentication Schemes
Schemes define how authentication works for different parts of your application. Each scheme can have its own:
- Providers (OAuth2, Credentials, etc.)
- Token handling options

```typescript
interface AuthScheme {
  id: string;
  name: string;
  providers: AuthProvider[];
  options: AuthSchemeOptions;
}
```

### Providers
Providers handle the actual authentication process with different services.

```typescript
interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'credentials' | 'passwordless';
  authorize(options: AuthorizeOptions): Promise<AuthResponse>;
  validateToken(token: string): Promise<boolean>;
}
```

### Storage Strategies
Define how authentication state is stored.

```typescript
interface StorageStrategy {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

## Authentication Flow

1. **Configuration**
```typescript
const auth = new AuthClient({
  schemes: {
    default: defaultScheme,
    admin: adminScheme
  },
  defaultScheme: 'default',
  storage: new LocalStorageStrategy()
});
```

2. **Login**
```typescript
await auth.login({
  provider: 'oauth2',
  scheme: 'default',
  params: {
    scope: ['profile', 'email']
  }
});
```

3**Logout**
```typescript
await auth.logout();
```

## Advanced Usage

### Custom Storage Strategy
```typescript
class CustomStorage implements StorageStrategy {
  async getItem(key: string): Promise<string | null> {
    // Your storage logic
  }

  async setItem(key: string, value: string): Promise<void> {
    // Your storage logic
  }

  async removeItem(key: string): Promise<void> {
    // Your storage logic
  }

  async clear(): Promise<void> {
    // Your storage logic
  }
}
```

### Framework Integration

#### React Integration
```typescript
function useAuth() {
  const auth = new AuthClient(config);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  return {
    isAuthenticated,
    login: auth.login.bind(auth),
    logout: auth.logout.bind(auth),
  };
}
```

#### Vue Integration
```typescript
// Coming soon
```

## API Reference

### AuthClient
The main class for interacting with the authentication system.

#### Methods

| Method            | Description       | Parameters         | Return Type             |
|-------------------|-------------------|--------------------|-------------------------|
| `login`           | Authenticate user | `AuthorizeOptions` | `Promise<AuthResponse>` |
| `logout`          | End session       | -                  | `Promise<void>`         |
| `isAuthenticated` | Check auth status | -                  | `Promise<boolean>`      |
| `getAccessToken`  | Get current token | -                  | `Promise<string>`       |

### Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### License
MIT License - see [LICENSE](LICENSE) for details.
