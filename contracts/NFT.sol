// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemSold;

    uint256 listingPrice = 0.0025 ether;
    address payable owner;
    mapping(uint256 => MarketItem) private idMarketItem;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the marketplace can change the listing price"
        );
        _;
    }

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        string title;
        string description;
        string target;
        string deadline;
        string image;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        string title,
        string description,
        string target,
        string deadline,
        string image
    );

    constructor() ERC721("NFT Metaverse Token", "MYNFT") {
        owner == payable(msg.sender);
    }

    function updateListingPrice(uint256 _listingPrice)
        public
        payable
        onlyOwner
    {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    //create "CREATE NFT TOKEN FUNC"

    function createToken(
        string memory title,
        string memory description,
        string memory target,
        string memory deadline,
        string memory image,
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(
            newTokenId,
            price,
            title,
            description,
            target,
            deadline,
            image
        );

        return newTokenId;
    }

    function getMarketItemById(uint256 tokenId)
        public
        view
        returns (MarketItem memory item)
    {
        // MarketItem[] memory items = new MarketItem[]();
        MarketItem memory currentItem = idMarketItem[tokenId];

        return currentItem;
    }

    function createMarketItem(
        uint256 tokenId,
        uint256 price,
        string memory title,
        string memory description,
        string memory target,
        string memory deadline,
        string memory image
    ) private {
        require(price > 0, "Price must be al lest 1");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            title,
            description,
            target,
            deadline,
            image
        );
        _transfer(msg.sender, address(this), tokenId);

        emit idMarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false,
            title,
            description,
            target,
            deadline,
            image
        );
    }

    // function for resale token
    function reSellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(msg.value == listingPrice, "Price must equal to list price");
        _itemSold.decrement();
        _transfer(msg.sender, address(this), tokenId);
        idMarketItem[tokenId].sold = false;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this));
        idMarketItem[tokenId].price = price;
    }

    // function create market sale

    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idMarketItem[tokenId].price;
        console.log(price);
        console.log(msg.value);

        require(
            msg.value == price,
            "Please submit the asking price in the order to complete the purchase"
        );
        // console.log(price);
        // console.log(msg.value);
        // console.log(msg.value >= price);
        require(
            msg.sender != idMarketItem[tokenId].seller,
            "Sellers can't buy their own nft"
        );

        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        // idMarketItem[tokenId].owner = payable(address(0));

        _itemSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(idMarketItem[tokenId].seller).transfer(msg.value);
    }

    function fetchMarketItem() public view returns (MarketItem[] memory item) {
        uint256 itemCount = _tokenIds.current();
        uint256 unSoldItemCount = _tokenIds.current() - _itemSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFT() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem memory currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemListed() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
