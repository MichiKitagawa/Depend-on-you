# scripts/test.sh

#!/bin/bash

set -e

echo "🧪 Running unit tests..."
npm run test

if [ $? -eq 0 ]; then
echo "✅ All tests passed."
else
echo "❌ Test failed. Please fix the issues above."
exit 1
fi