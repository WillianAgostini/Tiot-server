# mosquitto_pub -h localhost -t test -m "value1":20 mosquitto_pub -h localhost -t test -m "value2":40
mosquitto_pub -h 127.0.0.1 -p 1883 -t "tiot/5e1bd31d04076e2f69564d61/joker" -m "Joker!!" 

# for counter in $(seq 1 10000); 
# do mosquitto_pub -h 127.0.0.1 -p 1883 -t "tiot/joker/5e1bd31d04076e2f69564d61" -m "==== $counter ====" && echo "$counter"; 
# done