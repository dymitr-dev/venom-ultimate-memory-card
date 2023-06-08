// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface CardEvents {
    event Created(
        address owner,
        uint256 id,
        string name,
        string uri,
        string text,
        string[] keyLabels,
        string[] keyValues,
        uint256 balance,
        uint256 createdAt
    );

    event TextUpdated(address owner, uint256 id, string text);

    event KeysUpdated(
        address owner,
        uint256 id,
        string[] keyLabels,
        string[] keyValues
    );

    event BalanceIncreased(address owner, uint256 id, uint256 amount);

    event BalanceDecreased(address owner, uint256 id, uint256 amount);

    event Destroyed(address owner, uint256 id, uint256 balance);
}
