#!/bin/bash

if [ "$1" == "ioe" ]; then
  echo "🔧 Switching development profile to IOE Engineering..."
  sed -i "s/faculty: 'mbbs'/faculty: 'ioe'/g" hooks/use-user-profile.ts
  sed -i 's/faculty: "mbbs"/faculty: "ioe"/g' hooks/use-user-profile.ts
  echo "✅ Development profile set to IOE"
  echo "   Subjects: Physics, Chemistry, Mathematics, English"
elif [ "$1" == "mbbs" ] || [ "$1" == "iom" ]; then
  echo "🔧 Switching development profile to IOM MBBS..."
  sed -i "s/faculty: 'ioe'/faculty: 'mbbs'/g" hooks/use-user-profile.ts
  sed -i 's/faculty: "ioe"/faculty: "mbbs"/g' hooks/use-user-profile.ts
  echo "✅ Development profile set to MBBS"
  echo "   Subjects: Physics, Chemistry, Botany, Zoology, MAT"
else
  echo "Usage: ./switch-dev-faculty.sh [ioe|mbbs]"
  echo ""
  echo "Examples:"
  echo "  ./switch-dev-faculty.sh ioe   - Switch to IOE Engineering"
  echo "  ./switch-dev-faculty.sh mbbs  - Switch to IOM MBBS"
  exit 1
fi

echo ""
echo "🌐 Restart your dev server to see changes:"
echo "   npm run dev"
