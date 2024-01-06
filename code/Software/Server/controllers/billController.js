import mongoose from "mongoose";
import { Bill } from "../models/billModel.js";
import { ItemPurchased } from "../models/itemPurchasedModel.js";

export async function getAllBills(request, response) {
    try {
        const bills = await Bill.find();

        if (bills.length > 0) {
            return response.status(200).json({
                count: bills.length,
                data: bills,
            });
        } else {
            return response.status(404).json({ message: "No bills found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching bills." });
    }
}

export async function getBillById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid bill id`,
            });
        }

        let bill = await Bill.findById(id).exec();

        if (bill) {
            const items = await ItemPurchased.find({ billID: id });
            const billWithItems = { ...bill.toObject(), items };

            return response.status(200).json(billWithItems);
        } else {
            return response.status(404).json({ message: "Bill not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching bills." });
    }
}

export async function saveNewBill(request, response) {
    try {
        if (!request.body.totalAmount) {
            return response.status(400).send({
                message: `Send all required fields: Total amount`,
            });
        }

        const newBill = {
            totalAmount: request.body.totalAmount,
            paymentMethod: request.body.paymentMethod || "Cash",
            discountApplied: request.body.discountApplied || 0,
        };

        const bill = await Bill.create(newBill);
        return response.status(201).send(bill);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function updateBill(request, response) {
    try {
        if (!request.body.totalAmount) {
            return response.status(400).send({
                message: `Send all required fields: Total amount`,
            });
        }

        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid bill id`,
            });
        }

        const result = await Bill.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).send({
                message: `Bill not found`,
            });
        }

        return response.status(200).send({
            message: `Bill successfully updated!`,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function deleteBillById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid bill id`,
            });
        }

        const result = await Bill.findByIdAndDelete(id);

        if (result) {
            return response.status(404).json({
                message: `Bill successfully deleted!`,
            });
        } else {
            return response.status(404).json({ message: "Bill not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching bills." });
    }
}


export async function getBillsToday(request, response) {
    try {
        // Get the current date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    
        // Get bills created today
        const billsToday = await Bill.find({
          createdAt: { $gte: today },
        });
    
        // Get bills created yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        const billsYesterday = await Bill.find({
          createdAt: { $gte: yesterday, $lt: today },
        });
    
        // Calculate the bill count for today and yesterday
        const billCountToday = billsToday.length;
        const billCountYesterday = billsYesterday.length;
    
        // Calculate the percentage change
        const percentageChange = calculatePercentageChange(billCountYesterday, billCountToday);
    
        response.status(200).json({ billCountToday, billCountYesterday, percentageChange });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'An error occurred while fetching bill count.' });
      }
    };
    
    function calculatePercentageChange(previousValue, currentValue) {
      if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
      }
    
      return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    }
    export async function getBillCountPerdate(request, response) {
        try {
          const { day } = request.params;
          
          // Parse the day parameter to a Date object
          const selectedDay = new Date(day);
          selectedDay.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
      
          // Get bills created on the selected day
          const billsOnSelectedDay = await Bill.find({
            createdAt: { $gte: selectedDay, $lt: new Date(selectedDay.getTime() + 24 * 60 * 60 * 1000) },
          });
      
          // Calculate the bill count for the selected day
          const billCountSelectedDay = billsOnSelectedDay.length;
      
          response.status(200).json({ billCountSelectedDay });
        } catch (error) {
          console.error(error.message);
          response.status(500).json({ error: 'An error occurred while fetching the bill count for the selected day.' });
        }
      }
      
      