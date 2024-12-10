sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
sudo apt install npm -y
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `which node`
sudo bash build.bash
