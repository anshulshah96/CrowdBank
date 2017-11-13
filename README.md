CrowdBank
=========================
⚙️ Peer to Peer Loan System implemented on Ethereum Smart Contracts

_Entry for [Proffer's GENERATION BLOCKCHAIN Hackathon](https://proffer.network/hackathon) at IIT Delhi_

  * [Problem Statement](#problem-statement)
  * [Solution Abstract](#solution-abstract)
  * [Demo Video](https://www.youtube.com/watch?v=2gzZemUs150)
  * [System Architecture](#system-architecture)
  * [Setup](#setup)
  * [License](#license)

Problem Statement
==================

In current lending infrastructure, Banks act as intermediate b/w borrowers and lenders. The power to make decision rests with senior management instead of free market appetite. These intermediate parties were needed as open public editable ledgers were inconsistent.

There are several issues associated with centralised systems. Banks generally demand higher safety fraction/mortgage while giving out loans thus giving low growth opportunities to small scale industries, which otherwise could have flourished. Thus, Crowd Bank provides a crowd sourced loan platform where the lender gets to chose the exact amount and the rate at which he wants to lend depending on the purpose/mortgage offered and his own risk assessment. 

Solution Abstract
=====================

Our system leverages digital ownership management and proposes a system of Peer to Peer loan backed by digital Mortgages.
CrowdBank - built on Ethereum is a web platform that connects lenders to borrowers. A person in need of money can create a loan request setting one of his assets as mortgage. The lenders can see the existing loan requests, verify the mortgage and based on his own risk assessment, propose the amount and a rate of interest. The borrower can choose from among the various proposals received and select a subset of them suiting his needs. On completion of the money requirement, the borrower can chose to repay the loan and clear his mortgage.

Major benefits of using this decentralised system:
1. No transaction limit.
2. Individual's freedom to choose the risk associated.
3. Lenders will gain full interest without any broker's cuts. 
4. Reduction of Total Risk: Losses/Gains are randomly distributed and does not depend on one singular decisions taken by bank.
5. Open verifiability of the history associated (successful/failed loans) with a borrowers's account.

System Architecture
===========================

1. **A person in need (borrower) requests a loan** and **provides a digital mortgage as a security risk**. He also agrees on a due repay date, failing which he has to forfeit the mortgage. 
The ownership of **digital mortgage is publically verifiable** on a trusted government portal.
2. **Interested lenders will judge the mortgage** and propose their desired lending amount and their rate of interest. 
Borrower scrutinises the proposals and **Accepts** appropriate ones to achieve the target money. Other loans are **Reverted**. The funds are tranferred to the borrower.

![alt text](https://lh4.googleusercontent.com/oonjo_IALmIaF4nlc5O1Xyw0gAE8-EhjmQC8yM8v2CsdujjyPCzBr6cn6QwG8wc15kdKtdxGAzdBIQptuKVxbPUqcUNRq6tMmCkZPqd2NvK2yvZ_tUNotFe7lgEvFtMkzRm5Uppm "")

3. **Payment Scenario 1:** The borrower will repay amount anytime he wishes before due date, the interest will be incurred on this time period only.
4. **Payment Scenario 2:**  The due date passes, Any of the lender can now ask for mortgage transfer. The mortgage will be transferred to all the lenders stakewise.

![alt text](https://lh4.googleusercontent.com/vUDc-Sa8psKmRGXyoGeq1F22_f20VpIOlBSqJ6upDfQKpJZhEl2C9sCrLJ3yvhtQN2URLva3yAgh4xNLPTe2MceL5jyPlWPqBDtQdlTK8ePJGRoZPN79dlXxu5n2By6Mk5a1uDrk "Logo Title Text 1")

Setup
========
1. Install [testrpc]() and [Truffle Framework]().
2. Run ```git clone https://github.com/anshulshah96/LoanDe-centralised```
3. Run ```npm install``` inside the directory.
4. Run _testrpc_ in a new terminal.
5. Run ```truffle deploy``` to build and deploy contract.
6. Run ```npm run dev``` and go to [locahost:8080](http://localhost:8080).

License
===========

[MIT License](https://anshul.mit-license.org/)

The following people have been the contributors for the project. (Go star their repos :p)
 * [Anshul Shah](https://github.com/anshulshah96) 
 * [Nikhil Sheoran](https://github.com/nikhil96sher)
 * [Suraj Gupta](https://github.com/surajgupta97)
