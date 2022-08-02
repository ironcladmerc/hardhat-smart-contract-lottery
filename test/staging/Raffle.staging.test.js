const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../hardhat-helper-config")

console.log("Raffle.staging.test.js")
console.log(`Testing on network: ${network.name}`)

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              console.log(`Deployer: ${deployer}`)
              console.log(`Entrance fee: ${raffleEntranceFee}`)
              console.log(raffle)
          })

          describe("simple tests", function () {
              it("can enter the raffle", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  console.log("entered")
              })
          })

          describe("fulfill random words", function () {
              it("works with live chainlink keepers and chainlink VRF, we get a random winner", async function () {
                  const startingTimestamp = await raffle.getLatestTimestamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimestamp = await raffle.getLatestTimestamp()

                              await expect(raffle.getPlayer[0]).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState.toString(), "0")
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimestamp > startingTimestamp)
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log("entered raffle")
                      console.log(`winnerStartingBalance: ${winnerStartingBalance}`)
                  })
              })
          })
      })
