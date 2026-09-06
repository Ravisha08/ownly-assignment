import { LogBox } from 'react-native';

/**
 * Quiet down noise that comes from third-party packages (expo-router, React
 * Native internals) and cannot be fixed from app code. Dev-only.
 */
const IGNORED = [
  // expo-router internals still render the old RN SafeAreaView
  'SafeAreaView has been deprecated',
  // fires spuriously on the first render on slower dev machines
  'VirtualizedList: You have a large list that is slow to update',
];

if (__DEV__) {
  LogBox.ignoreLogs(IGNORED);

  const shouldDrop = (args: unknown[]) =>
    typeof args[0] === 'string' && IGNORED.some((msg) => args[0]!.toString().includes(msg));

  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (shouldDrop(args)) return;
    origWarn(...args);
  };

  const origLog = console.log;
  console.log = (...args: unknown[]) => {
    if (shouldDrop(args)) return;
    origLog(...args);
  };
}
