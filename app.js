const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const url = "mongodb://localhost:27017/todoDB";
const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const travelSchema = {
  title: String,
  date: String,
};

const Plan = mongoose.model("plan", travelSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/todoList", function (req, res) {
  Plan.find(function (err, plans) {
    if (!err) {
      res.render("TodoList", { plans: plans });
    } else {
      res.send(err);
    }
  });
});

app.route("/plans").post(function (req, res) {
  const plan = new Plan({
    title: req.body.title,
    date: req.body.date,
  });
  plan.save(function (err) {
    if (!err) {
      res.redirect("/todoList");
    } else {
      res.send(err);
    }
  });
});

app
  .route("/plans/:planId")
  .get(function (req, res) {
    Plan.findOne({ _id: req.params.planId }, function (err, foundPlan) {
      if (foundPlan) {
        res.render("Todo", { foundPlan: foundPlan });
      } else {
        res.send("Not found");
      }
    });
  })
  .post(function (req, res) {
    Plan.update(
      { _id: req.params.planId },
      { title: req.body.title, date: req.body.date },
      { overwrite: true },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/todoList");
        }
      }
    );
  });

app.post("/plans/delete/:planId", function (req, res) {
  Plan.deleteOne({ _id: req.params.planId }, function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started listening to post 3000");
});
