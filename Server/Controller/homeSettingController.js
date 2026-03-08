const HomeSetting = require("../Model/HomeSetting")


exports.getHomeSetting = async(req,res)=>{
    try {
        let setting = await HomeSetting.findOne();

        if(!setting){
            setting = await HomeSetting.create({
                homeLevel:"category"
            })
        }


        res.status(200).json(setting);
        
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}


exports.updateHomeSetting = async (req, res) => {
  try {
    const { homeLevel } = req.body;

    let setting = await HomeSetting.findOne();

    if (!setting) {
      setting = await HomeSetting.create({ homeLevel });
    } else {
      setting.homeLevel = homeLevel;
      await setting.save();
    }

    res.status(200).json({
      message: "Home page setting updated",
      setting,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




