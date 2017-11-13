LoanDe-centralised
=========================
⚙️ Peer to Peer Loan System implemented on Ethereum Smart Contracts

_Subission for Proffer's GENERATION BLOCKCHAIN at IIT Delhi_

  * [Problem Statement](#problem-statement)
  * [Solution Abstract](#solution-abstract)
  * [System Architecture](#system-architecture)
  * [Setup](#setup)
  * [License](#license)

Problem Statement
==================

In current lending infrastructure, Banks act as intermediate b/w borrowers and lenders. The power to make decision rests with senior management instead of free market appetite. These intermediate parties were needed as open public editable ledgers were inconsistent.

There are several issues associated with centralised systems. Banks generally demand higher safety fraction/mortgage while giving out loans thus giving low growth opportunities to small scale industries, which otherwise could have flourished. Thus, Crowd Bank provides a crowd sourced loan platform where the lender gets to chose the exact amount and the rate at which he wants to lend depending on the purpose/mortgage offered and his own risk assessment. 

Solution Abstract
=====================

The digitalisation of ownership proof in near future is inevitable and our system will leverage it as an government infrastructure. We propose a system of Peer to Peer loan backed by digital Mortgages. Our system is built on existing Ethereum currency ETH. 

System Architecture
===========================

1. **A person in need (borrower) requests a loan** and **provides a digital mortgage as a security risk**. He also agrees on a due repay date, failing which he has to forfeit the mortgage. 
The ownership of **digital mortgage is publically verifiable** on a trusted government portal.
2. **Interested lenders will judge the mortgage** and propose their desired lending amount and their rate of interest. 
Borrower scrutinises the proposals and **Accepts** appropriate ones to achieve the target money. Other loans are **Reverted**. The funds are tranferred to the borrower.

![Loan Proposal Architecture](https://user-images.githubusercontent.com/10174820/32730503-46ef430e-c8ad-11e7-9c5b-b096a21bbe95.png "Loan Proposal Architecture")

3. **Payment Scenario 1:** The borrower will repay amount anytime he wishes before due date, the interest will be incurred on this time period only.
4. **Payment Scenario 2:**  The due date passes, Any of the lender can now ask for mortgage transfer. The mortgage will be transferred to all the lenders stakewise.

![Repayment Architecture](https://user-images.githubusercontent.com/10174820/32730525-54897b6a-c8ad-11e7-89f0-370cf5af8d27.png "Repayment Architecture")

Setup
========
1. Install [testrpc](https://github.com/ethereumjs/testrpc) and [Truffle Framework](https://truffle.readthedocs.io/en/beta/getting_started/installation/).
2. Run ```git clone https://github.com/anshulshah96/LoanDe-centralised```
3. Run ```npm install``` inside the directory.
4. Run _testrpc_ in a new terminal.
5. Run ```truffle deploy``` to build and deploy contract.
6. Run ```npm run dev``` and go to [locahost:8080](localhost:8080).

License
===========

[MIT License](https://anshul.mit-license.org/)

The following people have been the contributors for the project:
 * [Anshul Shah](https://github.com/anshulshah96) 
 * [Nikhil Sheoran](https://github.com/nikhilsheoran96)
 * [Suraj Gupta](https://github.com/surajgupta97)


