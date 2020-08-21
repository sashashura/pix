if npm run lint:fix; then
  if npm run test:api:path $@ -- --bail; then
    echo "TCR => COMMIT"
    git commit -am "TCR:WIP"
  else
    echo "TCR => REVERT"
    git checkout HEAD lib/
  fi
else
  echo "TCR => ABORT"
fi
