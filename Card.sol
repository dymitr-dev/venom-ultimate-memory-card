// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CardEvents.sol";

contract Card is ERC721, ERC721URIStorage, Ownable, CardEvents {
    using Counters for Counters.Counter;

    Counters.Counter private counter;
    mapping(uint256 => Data) private cards;

    struct Data {
        string name;
        string uri;
        string text;
        string[] keyLabels;
        string[] keyValues;
        uint256 balance;
        uint256 createdAt;
    }

    struct Key {
        string label;
        string value;
    }

    modifier exists(uint256 id) {
        require(_exists(id), "Card does not exist");
        _;
    }

    constructor() ERC721("Card", "CARD") {}

    function create(
        string memory name,
        string memory uri,
        string memory text,
        Key[] memory keys
    ) public payable returns (uint256) {
        (string[] memory keyLabels, string[] memory keyValues) = extractKeys(
            keys
        );
        counter.increment();
        uint256 id = counter.current();
        _safeMint(msg.sender, id);
        _setTokenURI(id, uri);
        cards[id] = Data(
            name,
            uri,
            text,
            keyLabels,
            keyValues,
            msg.value,
            block.timestamp
        );
        emit Created(
            msg.sender,
            id,
            name,
            uri,
            text,
            keyLabels,
            keyValues,
            msg.value,
            block.timestamp
        );
        return id;
    }

    function get(uint256 id) public view exists(id) returns (Data memory) {
        Data storage card = cards[id];
        if (msg.sender == owner()) {
            return card;
        } else {
            return
                Data(
                    card.name,
                    card.uri,
                    card.text,
                    card.keyLabels,
                    new string[](0),
                    card.balance,
                    card.createdAt
                );
        }
    }

    function updateText(uint256 id, string memory text)
        public
        exists(id)
        onlyOwner
    {
        cards[id].text = text;
        emit TextUpdated(msg.sender, id, text);
    }

    function updateKeys(uint256 id, Key[] memory keys)
        public
        exists(id)
        onlyOwner
    {
        (string[] memory keyLabels, string[] memory keyValues) = extractKeys(
            keys
        );
        cards[id].keyLabels = keyLabels;
        cards[id].keyValues = keyValues;
        emit KeysUpdated(msg.sender, id, keyLabels, keyValues);
    }

    function increaseBalance(uint256 id) public payable exists(id) {
        cards[id].balance += msg.value;
        emit BalanceIncreased(msg.sender, id, msg.value);
    }

    function decreaseBalance(uint256 id, uint256 amount)
        public
        onlyOwner
        exists(id)
    {
        require(cards[id].balance >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        cards[id].balance -= amount;
        emit BalanceDecreased(msg.sender, id, amount);
    }

    function destroy(uint256 id) public onlyOwner exists(id) {
        payable(msg.sender).transfer(cards[id].balance);
        emit Destroyed(msg.sender, id, cards[id].balance);
        _burn(id);
        delete cards[id];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function extractKeys(Key[] memory keys)
        internal
        pure
        returns (string[] memory, string[] memory)
    {
        string[] memory keyLabels = new string[](keys.length);
        string[] memory keyValues = new string[](keys.length);
        for (uint256 i = 0; i < keys.length; i++) {
            keyLabels[i] = keys[i].label;
            keyValues[i] = keys[i].value;
        }
        return (keyLabels, keyValues);
    }
}
