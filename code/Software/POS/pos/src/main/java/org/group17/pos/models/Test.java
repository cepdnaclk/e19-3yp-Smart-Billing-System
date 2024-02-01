package org.group17.pos.models;

public class Test {
    private String productID;
    private String productName;
    private String category;
    private String description;
    private double unitPrice;
    private int quantity;
    private double amount;

    public Test(String productID, String productName, String category, double unitPrice, int quantity, double amount) {
        this.productID = productID;
        this.productName = productName;
        this.category = category;
//        this.description = description;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.amount = amount;
    }

    public String getProductID() {
        return productID;
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

//    public String getDescription() {
//        return description;
//    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getAmount() {
        return amount;
    }
}
