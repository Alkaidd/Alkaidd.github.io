#!/bin/bash
set -e

echo "安装依赖"
pnpm i

echo "构建项目"
pnpm run build

echo "切换分支到master"
git switch master

echo "删除旧的文件"
rm -r assets
rm -r static
rm index.html

echo "复制dist文件夹到当前目录"
cp -r dist/* .

echo "添加所有更改"
git add .

echo "提交更改"
git commit -m "$*"

echo "推送至远程仓库"
git push

echo "切换回main分支"
git switch main
