//
//  BLEManager.swift
//  MiD
//
//  Created by Michael Ngo on 7/10/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import CoreBluetooth

class BLEManager: RCTEventEmitter, CBCentralManagerDelegate {
  
  var central: CBCentralManager!
  
  var authServiceID: CBUUID!
  
  var helloServiceID: CBUUID!
  
  var alertServiceID: CBUUID!
  
  var configServiceID: CBUUID!
  
  var batteryServiceID: CBUUID!
  
  var infoServiceID: CBUUID!
  
  var alertService: CBService?
  
  var configService: CBService?
  
  var peripheral: CBPeripheral?
  
  var scanList: [String: CBPeripheral]
  
  var knownList: [String]
  
  override init() {
    scanList = [String: CBPeripheral]()
    batteryServiceID = CBUUID(string: "180F")
    infoServiceID = CBUUID(string: "180A")
    knownList = []
    super.init()
  }
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    self.central = central
    switch central.state {
    case .resetting:
      print("central.state is .resetting")
    case .unsupported:
      print("central.state is .unsupported")
    case .unauthorized:
      print("central.state is .unauthorized")
    case .poweredOff:
      print("central.state is .poweredOff")
    case .poweredOn:
      print("central.state is .poweredOn")
    case .unknown:
      print("central.state is .unknown")
    @unknown default:
      print("Error!")
    }
  }
  
  @objc func addAuthService(uuid: String) {
    authServiceID = CBUUID(string: uuid)
  }
  
  @objc func addHelloService(uuid: String) {
    helloServiceID = CBUUID(string: uuid)
  }
  
  @objc func addAlertService(uuid: String) {
    alertServiceID = CBUUID(string: uuid)
  }
  
  @objc func addConfigService(uuid: String) {
    configServiceID = CBUUID(string: uuid)
  }
  
  @objc func removePairing() {
    guard let peri = self.peripheral else {
      return
    }
    central.cancelPeripheralConnection(peri)
  }
  
  @objc func addKnownList(list: [String]) {
    knownList = list
  }
  
  @objc func scan() {
    if central.state == .poweredOn {
      central.scanForPeripherals(withServices: [helloServiceID], options: nil)
    }
  }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    self.peripheral = peripheral
    peripheral.discoverServices([authServiceID, alertServiceID, configServiceID, batteryServiceID, infoServiceID])
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    self.peripheral = nil
    sendEvent(withName: "disconnected", body: nil)
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    print(advertisementData)
    scanList[peripheral.identifier.uuidString] = peripheral
    let list = scanList.mapValues({ $0.name })
    sendEvent(withName: "discovered", body: list)
  }
  
  @objc func connect(uuid: String) {
    if let peri = scanList[uuid] {
      central.connect(peri, options: nil)
    }
  }
  
  override func supportedEvents() -> [String]! {
    return ["connected", "disconnected", "discovered", "authResponsed", "batteryUpdate", "alert", "configResponsed"]
  }
}
