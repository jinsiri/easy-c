import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'jsdom',
	preset: 'ts-jest',
	setupFilesAfterEnv: ['@testing-library/jest-dom'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transformIgnorePatterns: ['/node_modules/(?!(next)/)'],
};

export default config;
