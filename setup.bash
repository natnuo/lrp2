git clone https://github.com/natnuo/lrp2.git
sudo apt update
sudo apt install nodejs -y
sudo apt install npm -y
printf "GENERATE_SOURCEMAP=false\nPORT=80" >> ".env"
cd lrp2/client
npm install
npm run build
cd ../server
npm install
npm run build
