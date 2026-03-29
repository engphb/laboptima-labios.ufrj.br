#!/bin/bash

echo "Listando workflows no GitHub..."

# List all workflow files
FILES=$(curl -s -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
  "https://api.github.com/repos/engphb/laboptima-labios-website/contents/.github/workflows" \
  | grep '"name"' | grep -v "deploy.yml" | sed 's/.*"name": "\(.*\)".*/\1/')

echo "Workflows encontrados (além do deploy.yml):"
echo "$FILES"

for FILE in $FILES; do
  echo ""
  echo "Removendo: $FILE"
  SHA=$(curl -s -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
    "https://api.github.com/repos/engphb/laboptima-labios-website/contents/.github/workflows/$FILE" \
    | grep '"sha"' | head -1 | sed 's/.*"sha": "\(.*\)".*/\1/')

  if [ -n "$SHA" ]; then
    curl -s -X DELETE \
      -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      "https://api.github.com/repos/engphb/laboptima-labios-website/contents/.github/workflows/$FILE" \
      -d "{\"message\": \"Remove workflow desnecessário: $FILE\", \"sha\": \"$SHA\"}" \
      | grep -E '"message"|"commit"' | head -2
    echo "✓ $FILE removido"
  else
    echo "✗ Não foi possível obter SHA de $FILE"
  fi
done

echo ""
echo "Pronto! Agora rode: bash publicar.sh"
