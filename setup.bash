sudo apt update
sudo apt install nodejs -y
sudo apt install npm -y
printf "GENERATE_SOURCEMAP=false\nPORT=80" >> ".env"
cd lrp2
cd client
npm --max-old-space-size=800 install
npm run build
cd ../server
npm --max-old-space-size=800 install
npm run build
