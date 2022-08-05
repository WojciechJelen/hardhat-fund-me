import { ethers, run, network } from 'hardhat'

export const verifyContract = async (contractAddress: string, args?: any[]) => {
  try {
    /**
     * "run" lets you to run different hardhat commands programmatically
     */
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
    console.log('Contract verified')
  } catch (error: unknown) {
    if ((error as Error).message.toLowerCase().includes('already verfiied')) {
      console.log('Already verified')
    } else {
      console.log(error)
    }
  }
}
