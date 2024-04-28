cd ../
rm -rf go.sum go.mod
go mod init OWEApp
go mod tidy
go mod tidy -compat=1.17
export SELF_CFG_PATH=${PWD}
cd -
