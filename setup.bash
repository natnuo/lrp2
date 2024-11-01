sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
sudo apt install npm -y
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `which node`
printf "GENERATE_SOURCEMAP=false\nPORT=80" >> app.env
cd lrp2
cd client
npm --max-old-space-size=1500 install
node --max_old_space_size=1500 node_modules/.bin/react-scripts build
cd ../server
npm --max-old-space-size=1500 install
npm run build
